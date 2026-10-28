/**
 * Validação estrutural do conteúdo. Executada pelos testes (tests/content.test.ts)
 * para impedir que uma missão mal formada chegue ao jogo.
 */
import type { ChallengeStep, CodexEntry, AssessmentQuestion, MissionDefinition } from './types';
import { CONCEPT_IDS } from './concepts';

export interface ContentIssue {
  where: string;
  message: string;
}

function checkStep(step: ChallengeStep, where: string, issues: ContentIssue[]): void {
  const push = (message: string) => issues.push({ where, message });
  if (!step.prompt.trim()) push('prompt vazio');
  if (!step.hint.trim()) push('hint vazio');
  if (!step.explanation.trim()) push('explanation vazia');

  switch (step.kind) {
    case 'quiz': {
      const correct = step.options.filter((o) => o.correct).length;
      if (step.options.length < 2) push('quiz precisa de pelo menos 2 alternativas');
      if (!step.multiple && correct !== 1) push(`escolha única precisa de exatamente 1 correta (tem ${correct})`);
      if (step.multiple && correct < 1) push('múltipla escolha sem alternativa correta');
      if (new Set(step.options.map((o) => o.id)).size !== step.options.length) push('ids de alternativas repetidos');
      for (const o of step.options) if (!o.feedback.trim()) push(`alternativa ${o.id} sem feedback`);
      break;
    }
    case 'order':
      if (step.items.length < 3) push('ordenação precisa de pelo menos 3 itens');
      if (new Set(step.items.map((i) => i.id)).size !== step.items.length) push('ids de itens repetidos');
      break;
    case 'classify': {
      const buckets = new Set(step.buckets.map((b) => b.id));
      if (buckets.size < 2) push('classificação precisa de pelo menos 2 grupos');
      if (step.items.length < 3) push('classificação precisa de pelo menos 3 itens');
      for (const item of step.items) {
        if (!buckets.has(item.bucket)) push(`item ${item.id} aponta para grupo inexistente ${item.bucket}`);
        if (!item.feedback.trim()) push(`item ${item.id} sem feedback`);
      }
      break;
    }
    case 'shortcut':
      if (step.combos.length < 1) push('atalho sem combinação');
      for (const combo of [...step.combos, ...(step.mac ?? [])]) {
        if (combo.key !== combo.key.toLowerCase()) push(`tecla "${combo.key}" deve estar em minúsculas`);
      }
      break;
    case 'typing':
      if (step.text.length < 10) push('texto de digitação muito curto');
      if (step.minAccuracy <= 0 || step.minAccuracy > 1) push('minAccuracy deve estar entre 0 e 1');
      if (/[“”‘’—–…]/.test(step.text)) push('texto de digitação com caractere tipográfico difícil de digitar');
      break;
    case 'filesystem':
      if (step.goals.length < 1) push('explorador sem objetivos');
      if (!step.startPath.startsWith('/')) push('startPath deve começar com "/"');
      break;
    case 'terminal':
      if (step.goals.length < 1) push('terminal sem objetivos');
      if (!step.startPath.startsWith('/')) push('startPath deve começar com "/"');
      break;
    case 'settings': {
      const controls = new Set(step.panels.flatMap((p) => p.groups.flatMap((g) => g.controls.map((c) => c.id))));
      if (step.goals.length < 1) push('configurações sem objetivos');
      for (const g of step.goals) if (!controls.has(g.control)) push(`objetivo aponta para controle inexistente ${g.control}`);
      for (const f of step.forbidden ?? []) if (!controls.has(f.control)) push(`proibição aponta para controle inexistente ${f.control}`);
      break;
    }
    case 'diagnosis': {
      const stages = new Map(step.stages.map((s) => [s.id, s]));
      if (!stages.has(step.startStage)) push(`fase inicial ${step.startStage} inexistente`);
      let resolvable = false;
      for (const stage of step.stages) {
        const progressing = stage.actions.filter((a) => a.quality === 'best' || a.quality === 'good');
        if (progressing.length === 0) push(`fase ${stage.id} sem ação que avance`);
        if (!stage.actions.some((a) => a.quality === 'best')) push(`fase ${stage.id} sem ação "best"`);
        for (const a of stage.actions) {
          if (a.next && !stages.has(a.next)) push(`ação ${a.id} aponta para fase inexistente ${a.next}`);
          if ((a.quality === 'best' || a.quality === 'good') && !a.next && !a.resolves) {
            push(`ação ${a.id} avança mas não tem next nem resolves`);
          }
          if (a.resolves) resolvable = true;
        }
      }
      if (!resolvable) push('diagnóstico sem ação que resolva o problema');
      break;
    }
    case 'inspect': {
      const suspicious = step.parts.filter((p) => p.suspicious).length;
      if (step.minFlags < 1) push('minFlags deve ser pelo menos 1');
      if (step.minFlags > suspicious) push(`minFlags (${step.minFlags}) maior que partes suspeitas (${suspicious})`);
      const correct = step.verdict.options.filter((o) => o.correct).length;
      if (correct !== 1) push(`veredito precisa de exatamente 1 alternativa correta (tem ${correct})`);
      break;
    }
  }
}

export function validateMissions(missions: MissionDefinition[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const byId = new Map<string, MissionDefinition>();
  for (const m of missions) {
    if (byId.has(m.id)) issues.push({ where: m.id, message: 'id de missão duplicado' });
    byId.set(m.id, m);
  }
  for (const m of missions) {
    const where = m.id;
    if (!/^[a-z0-9-]+$/.test(m.id)) issues.push({ where, message: 'id deve usar apenas a-z, 0-9 e hífen' });
    if (m.steps.length < 2) issues.push({ where, message: 'missão precisa de pelo menos 2 etapas' });
    if (m.objectives.length < 1) issues.push({ where, message: 'missão sem objetivos' });
    if (!m.debrief.trim()) issues.push({ where, message: 'missão sem debrief' });
    for (const pre of m.prerequisites) {
      const target = byId.get(pre);
      if (!target) issues.push({ where, message: `pré-requisito inexistente ${pre}` });
      else if (target.sector !== m.sector) issues.push({ where, message: `pré-requisito ${pre} é de outro setor` });
    }
    const stepIds = new Set<string>();
    for (const step of m.steps) {
      if (stepIds.has(step.id)) issues.push({ where, message: `id de etapa duplicado ${step.id}` });
      stepIds.add(step.id);
      if (!m.concepts.includes(step.concept)) {
        issues.push({ where: `${where}/${step.id}`, message: `conceito ${step.concept} não listado em mission.concepts` });
      }
      checkStep(step, `${where}/${step.id}`, issues);
    }
  }
  // Ciclos de pré-requisitos
  const visiting = new Set<string>();
  const done = new Set<string>();
  const visit = (id: string, path: string[]): void => {
    if (done.has(id)) return;
    if (visiting.has(id)) {
      issues.push({ where: id, message: `ciclo de pré-requisitos: ${[...path, id].join(' → ')}` });
      return;
    }
    visiting.add(id);
    for (const pre of byId.get(id)?.prerequisites ?? []) visit(pre, [...path, id]);
    visiting.delete(id);
    done.add(id);
  };
  for (const id of byId.keys()) visit(id, []);
  return issues;
}

export function validateCodex(entries: CodexEntry[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const ids = new Set(entries.map((e) => e.id));
  for (const id of CONCEPT_IDS) if (!ids.has(id)) issues.push({ where: id, message: 'conceito sem entrada no Codex' });
  if (ids.size !== entries.length) issues.push({ where: 'codex', message: 'entradas duplicadas' });
  for (const e of entries) {
    if (!e.summary.trim() || !e.example.trim() || !e.whenToUse.trim()) {
      issues.push({ where: e.id, message: 'entrada incompleta' });
    }
    if (e.commonMistakes.length < 2) issues.push({ where: e.id, message: 'informe pelo menos 2 erros comuns' });
  }
  return issues;
}

export function validateAssessment(questions: AssessmentQuestion[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) issues.push({ where: q.id, message: 'id duplicado' });
    ids.add(q.id);
    if (q.step.multiple) issues.push({ where: q.id, message: 'avaliação usa apenas escolha única' });
    checkStep(q.step, q.id, issues);
  }
  return issues;
}

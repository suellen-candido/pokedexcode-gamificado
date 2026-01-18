import type { BattleState } from '@/lib/core/types/battle.type'

/**
 * Storage em memória para batalhas que persiste entre hot reloads
 * Em produção, isso deveria usar um banco de dados
 */
declare global {
  var battleStorageMap: Map<string, BattleState> | undefined
}

// Usa globalThis para persistir entre hot reloads no desenvolvimento
if (!global.battleStorageMap) {
  global.battleStorageMap = new Map<string, BattleState>()
}

export const battleStorage = global.battleStorageMap

/**
 * Salva uma batalha
 */
export function saveBattle(battle: BattleState): void {
  console.log('[BattleStorage] Salvando batalha:', battle.id)
  battleStorage.set(battle.id, battle)
  console.log('[BattleStorage] Total de batalhas:', battleStorage.size)
}

/**
 * Busca uma batalha por ID
 */
export function getBattle(battleId: string): BattleState | undefined {
  console.log('[BattleStorage] Buscando batalha:', battleId)
  console.log('[BattleStorage] Batalhas disponíveis:', Array.from(battleStorage.keys()))
  const battle = battleStorage.get(battleId)
  console.log('[BattleStorage] Batalha encontrada:', !!battle)
  return battle
}

/**
 * Remove uma batalha
 */
export function deleteBattle(battleId: string): boolean {
  return battleStorage.delete(battleId)
}

/**
 * Lista todas as batalhas
 */
export function getAllBattles(): BattleState[] {
  return Array.from(battleStorage.values())
}

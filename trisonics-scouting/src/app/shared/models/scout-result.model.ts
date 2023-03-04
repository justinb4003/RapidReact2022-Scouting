export interface ScoutResult {
  scouter_name: string,
  secret_team_key: string,
  event_key: string,
  match_key: string,
  scouting_team: number,
  team_name: string | undefined,

  auto_engaged: boolean | number,
  auto_docked: boolean | number,
  auto_community: boolean | number,
  endgame_engaged: boolean | number,
  endgame_docked: boolean | number,
  endgame_parked: boolean | number,
  
  auto_cubes_high: number,
  auto_cubes_medium: number,
  auto_cubes_low: number,
  auto_cones_high: number,
  auto_cones_medium: number,
  auto_cones_low: number,
  
  teleop_cubes_high: number,
  teleop_cubes_medium: number,
  teleop_cubes_low: number,
  teleop_cones_high: number,
  teleop_cones_medium: number,
  teleop_cones_low: number,

  match_notes: string,
}

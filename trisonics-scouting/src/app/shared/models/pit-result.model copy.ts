export interface PitResult {
  scouter_name: string,
  secret_team_key: string,
  event_key: string,
  match_key: string,
  scouting_team: number,
  drive_train: string,
  wheel_omni: boolean,
  wheel_mec: boolean,
  wheel_inflated: boolean,
  wheel_solid: boolean,
  robot_notes: string,
  images: string[],
}

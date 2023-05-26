export interface AddHoursFormData {
  username: string
  projectid: string
  date: string
  phaseid: string
  roleid: string
  hours: string
  note: string
  id?: any
}

export interface PhaseItem {
  Id: string
  Naam: string
}

export interface RoleItem {
  Id: string
  Naam: string
}

export interface ProjectItem {
  Id: number
  Projectcode: string
  Projectnaam: string
  versieid: number
  faseRequired: string
}

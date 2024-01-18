enum TOKEN {
  ACCESS = 'access',
  REFRESH = 'refresh'
}

interface IAuthToken {
  access: {
    token: string
    expires: string | Date
  }
  refresh: {
    token: string
    expires: string | Date
  }
}

export { TOKEN }
export type { IAuthToken }

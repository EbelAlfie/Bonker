export type GenerateRequest = {
    model: string,
    prompt: string,   
    system: string,
    stream: boolean,
    options?: OptionsRequest
}

export type OptionsRequest = {
  temperature: number
}

export type GenerateResponse = {
  model: string,
  created_at: string,
  response: string,
  done: boolean
}
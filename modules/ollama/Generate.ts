export type GenerateRequest = {
    model: string,
    prompt: string,   
    stream: boolean
}

export type GenerateResponse = {
  model: string,
  created_at: string,
  response: string,
  done: boolean
}
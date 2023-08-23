export interface IApp {
  status: 'idle' | 'loading' | 'success' | 'error';
  online: boolean;
}

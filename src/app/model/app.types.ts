interface ILayoutSettings {
  isSidebarVisible: boolean;
}

export interface IApp {
  status: 'idle' | 'loading' | 'success' | 'error';
  online: boolean;
  layout: ILayoutSettings;
}
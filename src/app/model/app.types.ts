export type LayoutSettings = {
    isSidebarVisible: boolean;
};

export interface IApp {
    status: 'idle' | 'loading' | 'success' | 'error';
    online: boolean;
    layout: LayoutSettings;
}

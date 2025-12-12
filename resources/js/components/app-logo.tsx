import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 flex-shrink-0">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>
            <div className="ml-3 grid flex-1 text-left min-w-0">
                <span className="truncate text-sm font-medium text-blue-600">
                    DMS Pro
                </span>
            </div>
        </>
    );
}

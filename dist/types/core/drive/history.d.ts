import { Location } from "../location";
import { Position } from "../types";
export interface HistoryDelegate {
    historyPoppedToLocationWithRestorationIdentifier(location: Location, restorationIdentifier: string): void;
}
declare type HistoryMethod = (this: typeof history, state: any, title: string, url?: string | null | undefined) => void;
export declare type RestorationData = {
    scrollPosition?: Position;
};
export declare type RestorationDataMap = {
    [restorationIdentifier: string]: RestorationData;
};
export declare class History {
    readonly delegate: HistoryDelegate;
    location: Location;
    initialLocation?: Location;
    restorationIdentifier: string;
    initialRestorationIdentifier?: string;
    restorationData: RestorationDataMap;
    started: boolean;
    pageLoaded: boolean;
    previousScrollRestoration?: ScrollRestoration;
    constructor(delegate: HistoryDelegate);
    start(): void;
    stop(): void;
    push(location: Location, restorationIdentifier?: string): void;
    replace(location: Location, restorationIdentifier?: string): void;
    update(method: HistoryMethod, location: Location, restorationIdentifier?: string): void;
    getRestorationDataForIdentifier(restorationIdentifier: string): RestorationData;
    updateRestorationData(additionalData: Partial<RestorationData>): void;
    onPopState: (event: PopStateEvent) => void;
    onPageLoad: (event: Event) => Promise<void>;
    shouldHandlePopState(): boolean;
    pageIsLoaded(): boolean;
    restorationIdentifierForPopState(event: PopStateEvent): any;
    poppedToInitialEntry(event: PopStateEvent): boolean | undefined;
}
export {};

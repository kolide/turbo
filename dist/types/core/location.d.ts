export declare type Locatable = Location | string;
export declare class Location {
    static get currentLocation(): Location;
    static wrap(locatable: Locatable): Location;
    static wrap(locatable?: Locatable | null): Location | undefined;
    readonly link: HTMLAnchorElement;
    private _requestURL?;
    private _anchor?;
    constructor(url: string);
    get absoluteURL(): string;
    get requestURL(): string;
    get origin(): string;
    get path(): string;
    get anchor(): string | undefined;
    get pathComponents(): string[];
    get lastPathComponent(): string;
    get extension(): string;
    isHTML(): boolean;
    isPrefixedBy(location: Location): boolean;
    isEqualTo(location?: Location): boolean | undefined;
    toCacheKey(): string;
    toJSON(): string;
    toString(): string;
    valueOf(): string;
}

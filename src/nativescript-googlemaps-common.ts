import {View, Property} from "ui/core/view";


export class TnsGoogleMapsBase extends View {
    public static mapLoadedEvent: string = "mapLoaded";
    public marker: boolean;

    public addMarker(marker) {
        // Overridden in platform-specific implementation
    }

    public clearMap() {
        // Overridden in platform-specific implementation
    }

    private _android: any;
    private _ios: any;
    private __nativeView: any;

    public get android(): any {
        return this._android;
    }

    public set android(value) {
        this._android = value;
    }

    public get ios(): any {
        return this._ios;
    }

    public set ios(value) {
        this._ios = value;
    }

    public get _nativeView(): any {
        return this.__nativeView;
    }

    public set _nativeView(value) {
        this.__nativeView = value;
    }
}

export const markerProperty = new Property<TnsGoogleMapsBase, any>({ name: "marker" });
markerProperty.register(TnsGoogleMapsBase);

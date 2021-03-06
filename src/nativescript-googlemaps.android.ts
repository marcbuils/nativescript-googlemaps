import { TnsGoogleMapsBase, markerProperty, MarkerInfo } from "./nativescript-googlemaps-common";
import * as application from "application";
import * as platform from "platform";

export { markerProperty, MarkerInfo };

var REQUEST_REQUIRED_PERMISSIONS = 1234;

export class TnsGoogleMaps extends TnsGoogleMapsBase {
    private googleMap: any;
    private hasPermissions: boolean;

    /**
     *
     */
    constructor() {
        super();
        this.hasPermissions = false;
        let currentContext = application.android.currentContext;
        if (parseInt(platform.device.sdkVersion) >= 23) {
            if ((<any>android.support.v4.content.ContextCompat).checkSelfPermission(currentContext, (<any>android).Manifest.permission.ACCESS_FINE_LOCATION) != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                let activityRequestPermissionHandler = (args: application.AndroidActivityRequestPermissionsEventData) => {
                    application.android.off(application.AndroidApplication.activityRequestPermissionsEvent, activityRequestPermissionHandler);
                    if (args.requestCode === REQUEST_REQUIRED_PERMISSIONS && args.grantResults.length > 0 && args.grantResults[0] === android.content.pm.PackageManager.PERMISSION_GRANTED) {
                        this.hasPermissions = true;
                        this.createNativeView();
                    } else {
                        return;
                    }
                };
                application.android.on(application.AndroidApplication.activityRequestPermissionsEvent, activityRequestPermissionHandler);
                (<any>android.support.v4.app).ActivityCompat.requestPermissions(currentContext, ['android.permission.ACCESS_FINE_LOCATION'], REQUEST_REQUIRED_PERMISSIONS);
            } else {
                this.hasPermissions = true;
            }
        } else {
            this.hasPermissions = true;
        }
    }

    public createNativeView() {
        let nativeView = new org.nativescript.widgets.ContentLayout(this._context);

        if (!this.hasPermissions) {
            return;
        }
        let id = android.view.View.generateViewId();
        nativeView.setId(id);
        let activity = this._context;
        let googleMapOptions = new com.google.android.gms.maps.GoogleMapOptions().
        compassEnabled(true);
        let mapFragment = com.google.android.gms.maps.MapFragment.newInstance(googleMapOptions);
        this.android = mapFragment;
        let transaction = activity.getFragmentManager().beginTransaction();
        transaction.add(id, mapFragment, "MAP_FRAGMENT");
        transaction.commit();
        let that = new WeakRef(this);
        let callback = new com.google.android.gms.maps.OnMapReadyCallback({
            onMapReady: function (gMap) {
                gMap.setMyLocationEnabled(true);
                let owner = that.get();
                if (owner) {
                    owner.googleMap = gMap;
                    if (owner.marker) {
                        owner.addMarker(owner.marker);
                    }
                    owner.notify({ eventName: TnsGoogleMaps.mapLoadedEvent, object: owner, map: gMap });
                }
            }
        });
        mapFragment.getMapAsync(callback);

        return nativeView;
    }

    public addMarker(marker: MarkerInfo) {
        if (marker && this.googleMap) {
            let newMarkerPosition = new com.google.android.gms.maps.model.LatLng(marker.latitude, marker.longitude);
            this.googleMap.addMarker(new com.google.android.gms.maps.model.MarkerOptions().position(newMarkerPosition));
            this.googleMap.moveCamera(com.google.android.gms.maps.CameraUpdateFactory.newLatLngZoom(newMarkerPosition, 15));
        }
    }

    public clearMap() {
        if (this.googleMap) {
            this.googleMap.clear();
        }
    }

    [markerProperty.getDefault](): MarkerInfo {
        return undefined;
    }

    [markerProperty.setNative](value: MarkerInfo) {
        if (value) {
            this.addMarker(value);
        } else {
            this.clearMap();
        }
    }
}
import React, { useEffect, useState } from 'react';
import { Map, Placemark, YMaps, TypeSelector } from "react-yandex-maps";
import Dialog from "@material-ui/core/Dialog/Dialog";
import { withStyles } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from "@material-ui/core/CircularProgress/CircularProgress";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#fff",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
        ) : null}
      </MuiDialogTitle>
  );
});

export const LongLatMap = (props) => {
  const {
    modalProps,
    setModalProps,
    title,
    coords,
    setCoors,
    region,
    district,
    street,
    house,
  } = props;

  const [mapInit, setMapInit] = useState({});
  const [ymaps, setYmaps] = useState(undefined);

  const onMapClick = (event) => {
    setCoors(event.get('coords'));
  };

  const onMapLoad = (ymaps) => {
    setYmaps(ymaps);
  };


  useEffect(() => {
    if (region) {
      const searchAddress = `Узбекистан, ${region}, ${district}${street ? ', ' + street : ""}${house ? ', ' + house : ""}`;

      let zoom = 13;
      if (street) {
        zoom = 15;
        if (house) {
          zoom = 17;
        }
      }

      if (ymaps) {
        ymaps.geocode(searchAddress).then(function (res) {
          const coords = res.geoObjects.get(0).geometry._coordinates;
          setMapInit({ centerCoords: coords, zoom: zoom });
        });
      }
    } else {
      setMapInit({ centerCoords: [41.311151, 69.279737], zoom: 12 });
    }
  }, [region, district, street, house, ymaps]);

  const handleClose = () => {
    setModalProps({ ...modalProps, visible: false });
  };

  const onExited = () => {
    setModalProps({ ...modalProps, shouldRender: false });
  };

  return (
      <Dialog
          open={modalProps.visible}
          onClose={handleClose}
          onExited={onExited}
          maxWidth={false}
          fullWidth={true}
          aria-labelledby="customized-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </DialogTitle>
        <div style={{ position: "relative", minHeight: 600 }}>
          <YMaps>
            <Map
                modules={['geocode']}
                state={{
                  center: mapInit.centerCoords || [41.311151, 69.279737],
                  zoom: mapInit.zoom || 12
                }}
                width={"100%"}
                height={600}
                onClick={onMapClick}
                onLoad={onMapLoad}
            >
              <TypeSelector options={{ float: 'right' }} />
              {coords ? (<Placemark
                  key={coords.join(",")}
                  geometry={coords}
              />) : null}
            </Map>
          </YMaps>
          {!mapInit.centerCoords && <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "rgba(0, 0, 0, .7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CircularProgress />
          </div>}
        </div>
      </Dialog>
  );

};

import React, { useEffect, useState } from "react";
import { Grid, Paper } from '@material-ui/core';
import { withTranslation } from "react-i18next";
import { Document, Page, pdfjs } from 'react-pdf';
import Terms from "../assets/documents/My+Online+Terms+and+Conditions.pdf";
import throttle from "lodash/throttle";
import GetAppIcon from '@material-ui/icons/GetApp';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const getWrWidth = () => {
  return document.getElementById('pdf-page1').getBoundingClientRect().width;
};



const TermsAndConditions = props => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [pdfWidth, setPdfWidth] = useState(null);

  useEffect(() => {
    setDivSize();
    window.addEventListener("resize", throttled);

    return () => {
      window.removeEventListener("resize", throttled);
    };
  }, []);


  const setDivSize = () => {
    setPdfWidth(getWrWidth());
  };

  const throttled = throttle(setDivSize, 500);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const newPdfWidth = Math.min(pdfWidth, 1200);

  return (
    <Grid container style={{ marginTop: 70 }}>
      <Grid item xs={12}>
        <Paper style={{ padding: 20, width: '100%', backgroundColor: 'white' }}>
          <Grid id="pdf-page1" container>
            <div style={{ margin: "0 auto" }}>
              <div style={{ textAlign: "right" }}>
                <a href={Terms} download="TermsAndConditions">
                  <GetAppIcon style={{ fontSize: "40px" }} />
                </a>
              </div>
              {newPdfWidth && <Document
                file={Terms}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.apply(null, Array(numPages))
                  .map((x, i)=>i+1)
                  .map(page => <Page key={page} pageNumber={page} width={newPdfWidth} />)}
              </Document>}
              <p>Page {pageNumber} of {numPages}</p>
            </div>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
};

export default withTranslation()(TermsAndConditions);

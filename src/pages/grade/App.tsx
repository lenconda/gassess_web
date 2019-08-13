import React from 'react';
import { ToastContainer } from 'react-toastify';
import './App.scss';

const App = (): JSX.Element => {
  return (
    <>
      <div className="container-fluid px-0">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
            <div className="zi-select-container small">
              <select className="zi-select">
                <option>First option</option>
                <option>Second option</option>
              </select>
              <i className="arrow zi-icon-up"></i>
            </div>
            <div className="zi-select-container small ml-2">
              <select className="zi-select">
                <option>First option</option>
                <option>Second option</option>
              </select>
              <i className="arrow zi-icon-up"></i>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} closeOnClick={false} />
    </>
  );
};

export default App;

import React from 'react';
import { ToastContainer } from 'react-toastify';
import './App.scss';

const App = (): JSX.Element => {
  return (
    <>
      <div className="container-fluid">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
            Content here
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} closeOnClick={false} />
    </>
  );
};

export default App;

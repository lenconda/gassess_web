import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { HashRouter as Router, Route, Redirect } from 'react-router-dom';

const Export = React.lazy(() => import('../../routes/export/Export'));

const App = (): JSX.Element => {
  return (
    <>
      <div className="container-fluid px-0">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
            <Suspense fallback="加载中...">
              <Router>
                <Route path="/:uuid?/order/:order?" component={Export} />
                <Redirect from="/" to="/undefined/order/desc" />
              </Router>
            </Suspense>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} closeOnClick={false} />
    </>
  );
};

export default App;

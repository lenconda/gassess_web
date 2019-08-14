import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { HashRouter as Router, Route } from 'react-router-dom';

const GradeAssess = React.lazy(() => import('../../routes/assess/GradeAssess'));

const App = (): JSX.Element => {
  return (
    <>
      <div className="container-fluid px-0">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
            <Suspense fallback="加载中...">
              <Router>
                <Route path="/:uuid?" component={GradeAssess} />
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

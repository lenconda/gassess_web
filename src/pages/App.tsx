import React, { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { HashRouter as Router, Route, NavLink, Redirect } from 'react-router-dom';

const StudentManage = React.lazy(() => import('../routes/root/StudentManage'));
const CourseManage = React.lazy(() => import('../routes/root/CourseManage'));

const App = (): JSX.Element => {
  return (
    <>
      <div className="container-fluid px-0">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
            <Suspense fallback={<div>加载中...</div>}>
              <Router>
                <div className="zi-switcher">
                  <NavLink activeClassName="active" to="/student">学生信息</NavLink>
                  <NavLink activeClassName="active" to="/course">课程信息</NavLink>
                </div>
                <Route path="/student" component={StudentManage} />
                <Route path="/course" component={CourseManage} />
                <Redirect from="/" to="/student" />
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

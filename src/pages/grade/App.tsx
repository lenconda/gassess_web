import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import { FileReaderEvent } from '../../utils/reader';
import http from '../../utils/http';
import Content from '../../components/content/Content';
import { ToastContainer } from 'react-toastify';

interface GradeInformation {
  courseName: string;
  courseId: string;
  createTime: number;
  uuid: string;
}

interface CourseInformation {
  name: string;
  uuid: string;
}

const GradeManage = (): JSX.Element => {
  const [selectedToImportFileName, setSelectedToImportFileName] = useState<string>('');
  const [importFileContentAsText, setImportFileContentAsText] = useState<string>('');
  const [gradeInformationList, setGradeInformationList] = useState<GradeInformation[]>([]);
  const [fetchGradeInformationLoading, setFetchGradeInformationLoading] = useState<boolean>(false);
  const [registerGradeLoading, setRegisterGradeLoading] = useState<boolean>(false);
  const [selectedGradeUuidList, setSelectedGradeUuidList] = useState<string[]>([]);
  const [deleteGradeLoading, setDeleteGradeLoading] = useState<boolean>(false);
  const [selectedCourseUuid, setSelectedCourseUuid] = useState<string>('');
  const [courseInformationList, setCourseInformationList] = useState<CourseInformation[]>([]);
  const [fetchCourseListLoading, setFetchCourseListLoading] = useState<boolean>(false);

  const fetchGradeInformationData = () => {
    setFetchGradeInformationLoading(true);
    http
      .get('/api/grade')
      .then(res => {
        setFetchGradeInformationLoading(false);
        if (res) {
          setGradeInformationList(res.data.data);
        }
      });
  };

  const fetchCourseListData = () => {
    setFetchCourseListLoading(true);
    http
      .get('/api/course')
      .then(res => {
        setFetchCourseListLoading(false);
        if (res) {
          setCourseInformationList(res.data.data.courses);
        }
      });
  };

  useEffect(() => {
    fetchGradeInformationData();
    fetchCourseListData();
    // eslint-disable-nextline
  }, []);

  const handleImportGrades = () => {
    setRegisterGradeLoading(true);
    http
      .post('/api/grade', {
        course: selectedCourseUuid,
        items: JSON.parse(importFileContentAsText)
      })
      .then(res => {
        setRegisterGradeLoading(false);
        if (res) {
          handleCleanRegisterGradeInput();
          fetchGradeInformationData();
        }
      });
  };

  const handleCleanRegisterGradeInput = () => {
    setSelectedToImportFileName('');
    setImportFileContentAsText('');
  };

  const handleTableCheckboxEvent = (event, uuid) => {
    console.log(event, uuid);
    if (event.target.checked) {
      setSelectedGradeUuidList([...selectedGradeUuidList, uuid]);
    } else {
      setSelectedGradeUuidList(selectedGradeUuidList.filter((value, filterIndex) => value !== uuid));
    }
  };

  const handleTableHeaderCheckboxEvent = (event) => {
    if (!event.target.checked) {
      setSelectedGradeUuidList([]);
    } else {
      setSelectedGradeUuidList(gradeInformationList.map((value, index) => value.uuid));
    }
  };

  const handleDeleteSelectedGrades = (uuid?: string) => {
    if (confirm(`确实要删除${uuid ? '这' : ` ${selectedGradeUuidList.length} `}个成绩吗`)) {
      setDeleteGradeLoading(true);
      http
        .delete('/api/grade', {
          data: {
            grades: uuid ? [uuid] : selectedGradeUuidList
          }
        })
        .then(res => {
          setDeleteGradeLoading(false);
          fetchGradeInformationData();
        });
    }
  };

  return (
    <>
      <div className="container-fluid px-0">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-8">
            <div className="result-container">
              <div className="input-group mb-3">
                <div className="zi-select-container small mb-2">
                  <select className="zi-select" defaultValue="" onChange={event => setSelectedCourseUuid(event.target.value)}>
                    <option value="">{fetchCourseListLoading ? '加载中...' : '请选择课程'}</option>
                    {
                      courseInformationList.map((value, index) => (
                        <option key={index} value={value.uuid}>{value.name} ({value.uuid})</option>
                      ))
                    }
                  </select>
                  <i className="arrow zi-icon-up"></i>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="inputGroupFile"
                    disabled={selectedCourseUuid === ''}
                    accept="application/json"
                    onChange={
                      event => {
                        setSelectedToImportFileName(event.target.files[0].name);
                        const importFileReader = new FileReader();
                        importFileReader.onload =
                          (event: FileReaderEvent) => setImportFileContentAsText(event.target.result);
                        importFileReader.readAsText(event.target.files[0]);
                      }
                    }
                  />
                  <label className="custom-file-label" htmlFor="inputGroupFile">
                    {selectedCourseUuid !== '' ? (selectedToImportFileName || '从文件导入...') : '请先选择课程'}
                  </label>
                </div>
                {
                  selectedToImportFileName &&
                    <>
                      <div className="input-group-append">
                        <Button type="primary" size="small" width="auto" loading={registerGradeLoading} onClick={handleImportGrades}>
                          <i className="fa fa-download"></i>
                          &nbsp;导入
                        </Button>
                      </div>
                      <div className="input-group-append">
                        <Button type="danger" size="small" width="auto" onClick={handleCleanRegisterGradeInput}>
                          <i className="fa fa-trash"></i>
                          &nbsp;清空
                        </Button>
                      </div>
                    </>
                }
                {
                  selectedGradeUuidList.length !== 0 &&
                  <div className="input-group-append">
                    <Button type="danger" size="small" width="auto" loading={deleteGradeLoading} onClick={() => handleDeleteSelectedGrades()}>
                      <i className="fa fa-times"></i>&nbsp;删除 {selectedGradeUuidList.length} 门课程
                    </Button>
                  </div>
                }
              </div>

              <div className="result-table">
                <Content loading={fetchGradeInformationLoading}>
                  <table className="zi-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            checked={selectedGradeUuidList.length === gradeInformationList.length}
                            onChange={event => handleTableHeaderCheckboxEvent(event)}
                          />
                        </th>
                        <th>成绩 ID</th>
                        <th>课程</th>
                        <th>创建时间</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        gradeInformationList ?
                          gradeInformationList.map((value, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={selectedGradeUuidList.includes(value.uuid)}
                                  onChange={event => handleTableCheckboxEvent(event, value.uuid)}
                                />
                              </td>
                              <td>{value.uuid}</td>
                              <td>{value.courseName} ({value.courseId})</td>
                              <td>{new Date(value.createTime).toLocaleString()}</td>
                              <td>
                                <Button
                                  onClick={() => window.location.replace(`/assess/#/${value.uuid}`)}
                                  className="mr-1 mb-1"
                                  type="primary"
                                  size="mini"
                                  width="auto"
                                  data-toggle="modal"
                                  data-target="#detail-modal"
                                >
                                  <i className="fa fa-bar-chart"></i>&nbsp;分析
                                </Button>
                                <Button type="danger" size="mini" width="auto" onClick={() => handleDeleteSelectedGrades(value.uuid)}>
                                  <i className="fa fa-trash"></i>&nbsp;删除
                                </Button>
                              </td>
                            </tr>
                          ))
                          : null
                      }
                    </tbody>
                  </table>
                </Content>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={5000} closeOnClick={false} />
    </>
  );
};

export default GradeManage;

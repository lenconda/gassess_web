import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import { FileReaderEvent } from '../../utils/reader';
import http from '../../utils/http';
import Content from '../../components/content/Content';

interface CourseInformation {
  name: string;
  uuid: string;
}

const CourseManage = (): JSX.Element => {
  const [selectedToImportFileName, setSelectedToImportFileName] = useState<string>('');
  const [importFileContentAsText, setImportFileContentAsText] = useState<string>('');
  const [courseInformationList, setCourseInformationList] = useState<CourseInformation[]>([]);
  const [fetchCourseInformationLoading, setFetchCourseInformationLoading] = useState<boolean>(false);
  const [registerCourseLoading, setRegisterCourseLoading] = useState<boolean>(false);
  const [selectedCourseUuidList, setSelectedCourseUuidList] = useState<string[]>([]);
  const [deleteCourseLoading, setDeleteCourseLoading] = useState<boolean>(false);

  const fetchCourseInformationData = () => {
    setFetchCourseInformationLoading(true);
    http
      .get('/api/course')
      .then(res => {
        setFetchCourseInformationLoading(false);
        if (res) {
          setCourseInformationList(res.data.data.courses);
        }
      });
  };

  useEffect(() => {
    fetchCourseInformationData();
    // eslint-disable-nextline
  }, []);

  const handleImportCourses = () => {
    setRegisterCourseLoading(true);
    http
      .post('/api/course', {
        courses: JSON.parse(importFileContentAsText)
      })
      .then(res => {
        setRegisterCourseLoading(false);
        if (res) {
          handleCleanRegisterCourseInput();
          fetchCourseInformationData();
        }
      });
  };

  const handleCleanRegisterCourseInput = () => {
    setSelectedToImportFileName('');
    setImportFileContentAsText('');
  };

  const handleTableCheckboxEvent = (event, uuid) => {
    console.log(event, uuid);
    if (event.target.checked) {
      setSelectedCourseUuidList([...selectedCourseUuidList, uuid]);
    } else {
      setSelectedCourseUuidList(selectedCourseUuidList.filter((value, filterIndex) => value !== uuid));
    }
  };

  const handleTableHeaderCheckboxEvent = (event) => {
    if (!event.target.checked) {
      setSelectedCourseUuidList([]);
    } else {
      setSelectedCourseUuidList(courseInformationList.map((value, index) => value.uuid));
    }
  };

  const handleDeleteSelectedCourses = (uuid?: string) => {
    if (confirm(`确实要删除${uuid ? '这' : ` ${selectedCourseUuidList.length} `}门课程吗`)) {
      setDeleteCourseLoading(true);
      http
        .delete('/api/course', {
          data: {
            courses: uuid ? [uuid] : selectedCourseUuidList
          }
        })
        .then(res => {
          setDeleteCourseLoading(false);
          fetchCourseInformationData();
        });
    }
  };

  return (
    <div className="result-container">
      <div className="input-group mb-3">
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="inputGroupFile"
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
            {selectedToImportFileName || '从文件导入...'}
          </label>
        </div>
        {
          selectedToImportFileName &&
            <>
              <div className="input-group-append">
                <Button type="primary" size="small" width="auto" loading={registerCourseLoading} onClick={handleImportCourses}>
                  <i className="fa fa-download"></i>
                  &nbsp;导入
                </Button>
              </div>
              <div className="input-group-append">
                <Button type="danger" size="small" width="auto" onClick={handleCleanRegisterCourseInput}>
                  <i className="fa fa-trash"></i>
                  &nbsp;清空
                </Button>
              </div>
            </>
        }
        {
          selectedCourseUuidList.length !== 0 &&
            <div className="input-group-append">
              <Button type="danger" size="small" width="auto" loading={deleteCourseLoading} onClick={() => handleDeleteSelectedCourses()}>
                <i className="fa fa-times"></i>
                    &nbsp;删除 {selectedCourseUuidList.length} 门课程
              </Button>
            </div>
        }
      </div>

      <div className="result-table">
        <Content loading={fetchCourseInformationLoading}>
          <table className="zi-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedCourseUuidList.length === courseInformationList.length}
                    onChange={event => handleTableHeaderCheckboxEvent(event)}
                  />
                </th>
                <th>课程 ID</th>
                <th>名称</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {
                courseInformationList ?
                  courseInformationList.map((value, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCourseUuidList.includes(value.uuid)}
                          onChange={event => handleTableCheckboxEvent(event, value.uuid)}
                        />
                      </td>
                      <td>{value.uuid}</td>
                      <td>{value.name}</td>
                      <td>
                        <Button type="danger" size="mini" width="auto" onClick={() => handleDeleteSelectedCourses(value.uuid)}>
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
  );
};

export default CourseManage;

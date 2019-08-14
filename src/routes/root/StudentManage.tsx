import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import { FileReaderEvent } from '../../utils/reader';
import http from '../../utils/http';
import Content from '../../components/content/Content';

interface StudentInformation {
  name: string;
  uuid: string;
}

const StudentManage = (): JSX.Element => {
  const [selectedToImportFileName, setSelectedToImportFileName] = useState<string>('');
  const [importFileContentAsText, setImportFileContentAsText] = useState<string>('');
  const [studentInformationList, setStudentInformationList] = useState<StudentInformation[]>([]);
  const [fetchStudentInformationLoading, setFetchStudentInformationLoading] = useState<boolean>(false);
  const [registerStudentLoading, setRegisterStudentLoading] = useState<boolean>(false);
  const [selectedStudentUuidList, setSelectedStudentUuidList] = useState<string[]>([]);
  const [deleteStudentLoading, setDeleteStudentLoading] = useState<boolean>(false);

  const fetchStudentInformationData = () => {
    setFetchStudentInformationLoading(true);
    http
      .get('/api/student')
      .then(res => {
        setFetchStudentInformationLoading(false);
        if (res) {
          setStudentInformationList(res.data.data.students);
        }
      });
  };

  useEffect(() => {
    fetchStudentInformationData();
    // eslint-disable-nextline
  }, []);

  const handleRegisterStudents = () => {
    setRegisterStudentLoading(true);
    http
      .post('/api/student', {
        students: JSON.parse(importFileContentAsText)
      })
      .then(res => {
        setRegisterStudentLoading(false);
        if (res) {
          handleCleanRegisterStudentInput();
          fetchStudentInformationData();
        }
      });
  };

  const handleCleanRegisterStudentInput = () => {
    setSelectedToImportFileName('');
    setImportFileContentAsText('');
  };

  const handleTableCheckboxEvent = (event, uuid) => {
    console.log(event, uuid);
    if (event.target.checked) {
      setSelectedStudentUuidList([...selectedStudentUuidList, uuid]);
    } else {
      setSelectedStudentUuidList(selectedStudentUuidList.filter((value, filterIndex) => value !== uuid));
    }
  };

  const handleTableHeaderCheckboxEvent = (event) => {
    if (!event.target.checked) {
      setSelectedStudentUuidList([]);
    } else {
      setSelectedStudentUuidList(studentInformationList.map((value, index) => value.uuid));
    }
  };

  const handleDeleteSelectedStudents = (uuid?: string) => {
    if (confirm(`确实要删除${uuid ? '这' : ` ${selectedStudentUuidList.length} `}名学生吗`)) {
      setDeleteStudentLoading(true);
      http
        .delete('/api/student', {
          data: {
            students: uuid ? [uuid] : selectedStudentUuidList
          }
        })
        .then(res => {
          setDeleteStudentLoading(false);
          fetchStudentInformationData();
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
                <Button type="primary" size="small" width="auto" loading={registerStudentLoading} onClick={handleRegisterStudents}>
                  <i className="fa fa-download"></i>
                  &nbsp;导入
                </Button>
              </div>
              <div className="input-group-append">
                <Button type="danger" size="small" width="auto" onClick={handleCleanRegisterStudentInput}>
                  <i className="fa fa-trash"></i>
                  &nbsp;清空
                </Button>
              </div>
            </>
        }
        {
          selectedStudentUuidList.length !== 0 &&
            <div className="input-group-append">
              <Button type="danger" size="small" width="auto" loading={deleteStudentLoading} onClick={() => handleDeleteSelectedStudents()}>
                <i className="fa fa-times"></i>
                    &nbsp;删除 {selectedStudentUuidList.length} 个学生
              </Button>
            </div>
        }
      </div>

      <div className="result-table mb-3">
        <Content loading={fetchStudentInformationLoading}>
          <table className="zi-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedStudentUuidList.length === studentInformationList.length}
                    onChange={event => handleTableHeaderCheckboxEvent(event)}
                  />
                </th>
                <th>学号</th>
                <th>姓名</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {
                studentInformationList ?
                  studentInformationList.map((value, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedStudentUuidList.includes(value.uuid)}
                          onChange={event => handleTableCheckboxEvent(event, value.uuid)}
                        />
                      </td>
                      <td>{value.uuid}</td>
                      <td>{value.name}</td>
                      <td>
                        <Button type="danger" size="mini" width="auto" onClick={() => handleDeleteSelectedStudents(value.uuid)}>
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

export default StudentManage;

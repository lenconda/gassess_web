import React, { useState, useEffect } from 'react';
import './style.scss';
import Button from '../../components/button/Button';
import { FileReaderEvent } from '../../utils/reader';
import http from '../../utils/http';

const StudentManage = (): JSX.Element => {
  const [selectedToImportFileName, setSelectedToImportFileName] = useState<string>('');
  const [importFileContentAsText, setImportFileContentAsText] = useState<string>('');

  const handleRegisterStudents = () => {
    http
      .post('/api/students', {
        students: JSON.parse(importFileContentAsText)
      });
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
            <div className="input-group-append">
              <Button type="primary" size="small" width="auto" onClick={handleRegisterStudents}>
                <i className="fa fa-download"></i>
              &nbsp;导入
              </Button>
            </div>
        }
      </div>

      <div className="result-table">
        <table className="zi-table">
          <thead>
            <tr>
              <th></th>
              <th>NAME</th>
              <th>USERNAME</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><img className="zi-avatar" src="..." /></td>
              <td>Evil Rabbit</td>
              <td>evilrabbit</td>
            </tr>
            <tr>
              <td><img className="zi-avatar" src="..." /></td>
              <td>Evil Rabbit</td>
              <td>evilrabbit</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default StudentManage;

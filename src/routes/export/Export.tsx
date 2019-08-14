import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import http from '../../utils/http';
import Button from '../../components/button/Button';
import Content from '../../components/content/Content';
import download from 'js-file-download';
import { Parser } from 'json2csv';

interface ExportProps extends RouteComponentProps {}

interface DetailedGradeInformationItem {
  studentName: string;
  studentId: string;
  grade: number;
}

interface GradeReportitem {
  uuid: string;
  createTime: number;
  courseId: string;
  courseName: string;
}

const Export = (props: ExportProps): JSX.Element => {
  const [gradeReportListData, setGradeReportListData] = useState<GradeReportitem[]>([]);
  const [fetchGradeReportListLoading, setFetchGradeReportListLoading] = useState<boolean>(false);
  const [gradeRankList, setGradeRankList] = useState<DetailedGradeInformationItem[]>([]);
  const [handleDownloadLoading, setHandleDownloadLoading] = useState<boolean>(false);
  const [fetchGradeRankListLoading, setFetchGradeRankListLoading] = useState<boolean>(false);

  const uuid = props.match.params['uuid'] || '';
  const order = props.match.params['order'] || 'desc';

  const fetchGradeReportListData = () => {
    setFetchGradeReportListLoading(true);

    http
      .get('/api/grade')
      .then(res => {
        setFetchGradeReportListLoading(false);

        if (res) {
          setGradeReportListData(res.data.data);
        }
      });
  };

  const fetchGradeRankList = () => {
    setFetchGradeRankListLoading(true);

    http
      .get(`/api/grade/rank/${uuid}/order/${order}/count/-1`)
      .then(res => {
        setFetchGradeRankListLoading(false);

        if (res) {
          setGradeRankList(res.data.data);
        }
      });
  };

  const handleDownloadCsvFile = () => {
    setHandleDownloadLoading(true);
    const parser = new Parser();
    const CSVDataFromJson = parser.parse(gradeRankList);
    download(CSVDataFromJson, `${Date.now()}.export.csv`);
    setHandleDownloadLoading(false);
  };

  useEffect(() => {
    fetchGradeReportListData();
  }, []);

  useEffect(() => {
    uuid && fetchGradeRankList();
    // eslint-disable-nextline
  }, [uuid, order]);

  return (
    <div>
      <div className="zi-select-container small mb-3">
        <select className="zi-select" value={uuid} onChange={event => props.history.push(`/${event.target.value}/order/${order}`)}>
          <option value="">{fetchGradeReportListLoading ? '加载中...' : '请选择成绩单'}</option>
          {
            gradeReportListData.map((value, index) => (
              <option key={index} value={value.uuid}>{value.courseName} - {value.uuid}</option>
            ))
          }
        </select>
        <i className="arrow zi-icon-up"></i>
      </div>

      <div className="zi-select-container small mb-3 ml-1">
        <select className="zi-select" value={order} onChange={event => props.history.push(`/${uuid}/order/${event.target.value}`)}>
          <option value="desc">降序排列</option>
          <option value="asc">升序排列</option>
        </select>
        <i className="arrow zi-icon-up"></i>
      </div>

      {
        (uuid && uuid !== 'undefined') &&
          <Button className="ml-1" type="success" size="small" width="auto" loading={handleDownloadLoading} onClick={() => handleDownloadCsvFile()}>
            <i className="fa fa-download"></i>&nbsp;导出数据
          </Button>
      }

      <Content loading={fetchGradeRankListLoading}>
        <table className="zi-table mb-3">
          <thead>
            <tr>
              <th>姓名</th>
              <th>学号</th>
              <th>成绩</th>
            </tr>
          </thead>
          <tbody>
            {
              gradeRankList ?
                gradeRankList.map((value, index) => (
                  <tr key={index}>
                    <td>{value.studentName}</td>
                    <td>{value.studentId}</td>
                    <td>{value.grade}</td>
                  </tr>
                ))
                : null
            }
          </tbody>
        </table>
      </Content>
    </div>
  );
};

export default Export;

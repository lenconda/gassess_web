import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import http from '../../utils/http';
import Content from '../../components/content/Content';
import Card, { Schema } from '../../components/card/Card';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from 'bizcharts';

interface GradeAssessProps extends RouteComponentProps {}

interface DetailedGradeInformationItem {
  studentName: string;
  studentId: string;
  grade: number;
}

interface DetailedGradeStatisticsData {
  highest: number;
  lowest: number;
  average: number;
}

interface GradeReportitem {
  uuid: string;
  createTime: number;
  courseId: string;
  courseName: string;
}

const GradeAssess = (props: GradeAssessProps): JSX.Element => {
  const [gradeReportListData, setGradeReportListData] = useState<GradeReportitem[]>([]);
  const [fetchGradeReportListLoading, setFetchGradeReportListLoading] = useState<boolean>(false);
  const [detailedGradeStatisticsData, setDetailedGradeStatisticsData] =
    useState<DetailedGradeStatisticsData>({ highest: 0, lowest: 0, average: 0 });
  const [fetchDetailedGradeStatisticsLoading, setFetchDetailedGradeStatisticsLoading] = useState<boolean>(false);

  const uuid = props.match.params['uuid'] || '';

  const fetchDetailedGradeStatics = () => {
    setFetchDetailedGradeStatisticsLoading(true);

    http
      .get(`/api/grade/stats/${uuid}`)
      .then(res => {
        setFetchDetailedGradeStatisticsLoading(false);

        if (res) {
          setDetailedGradeStatisticsData(res.data.data);
        }
      });
  };

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

  useEffect(() => {
    fetchGradeReportListData();
  }, []);

  useEffect(() => {
    fetchDetailedGradeStatics();
    // eslint-disable-nextline
  }, [uuid]);

  const schema: Schema[] = [
    { key: 'highest', title: '最高分' },
    { key: 'lowest', title: '最低分' },
    { key: 'average', title: '平均分' }
  ];

  return (
    <div>
      <div className="zi-select-container small mb-3">
        <select className="zi-select" defaultValue={uuid} onChange={event => props.history.push(`/${event.target.value}`)}>
          <option value="">{fetchGradeReportListLoading ? '加载中...' : '请选择成绩单'}</option>
          {
            gradeReportListData.map((value, index) => (
              <option key={index} value={value.uuid} selected={uuid === value.uuid}>{value.courseName} - {value.uuid}</option>
            ))
          }
        </select>
        <i className="arrow zi-icon-up"></i>
      </div>

      {
        (detailedGradeStatisticsData.lowest !== 0
          && detailedGradeStatisticsData.highest !== 0
          && detailedGradeStatisticsData.average !== 0) &&
          <Content loading={fetchDetailedGradeStatisticsLoading}>
            <Card schema={schema} data={detailedGradeStatisticsData} />
          </Content>
      }
    </div>
  );
};

export default GradeAssess;

import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import http from '../../utils/http';
import Content from '../../components/content/Content';
import Card, { Schema } from '../../components/card/Card';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

interface GradeAssessProps extends RouteComponentProps {}

interface GradePiechartItem {
  grade: string;
  count: number;
}

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
  const [gradeRankList, setGradeRankList] = useState<DetailedGradeInformationItem[]>([]);
  const [fetchGradeRankListLoading, setFetchGradeRankListLoading] = useState<boolean>(false);
  const [gradePiechartData, setGradePiechartData] = useState<GradePiechartItem[]>([]);
  const [fetchGradePiechartDataLoading, setFetchGradePiechartDataLoading] = useState<boolean>(false);

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

  const fetchGradeRankList = () => {
    setFetchGradeRankListLoading(true);

    http
      .get(`/api/grade/rank/${uuid}/order/desc/count/5`)
      .then(res => {
        setFetchGradeRankListLoading(false);

        if (res) {
          setGradeRankList(res.data.data);
        }
      });
  };

  const fetchGradePiechartData = () => {
    setFetchGradePiechartDataLoading(true);

    http
      .get(`/api/grade/piechart/${uuid}`)
      .then(res => {
        setFetchGradePiechartDataLoading(false);

        if (res) {
          setGradePiechartData(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchGradeReportListData();
  }, []);

  useEffect(() => {
    fetchDetailedGradeStatics();
    fetchGradeRankList();
    fetchGradePiechartData();
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
        <select className="zi-select" value={uuid} onChange={event => props.history.push(`/${event.target.value}`)}>
          <option value="">{fetchGradeReportListLoading ? '加载中...' : '请选择成绩单'}</option>
          {
            gradeReportListData.map((value, index) => (
              <option key={index} value={value.uuid}>{value.courseName} - {value.uuid}</option>
            ))
          }
        </select>
        <i className="arrow zi-icon-up"></i>
      </div>

      {
        (detailedGradeStatisticsData.lowest !== 0
          && detailedGradeStatisticsData.highest !== 0
          && detailedGradeStatisticsData.average !== 0) &&
          <Content loading={fetchDetailedGradeStatisticsLoading} className="mb-3">
            <Card schema={schema} data={detailedGradeStatisticsData} />
          </Content>
      }

      {
        (fetchGradeRankListLoading || gradeRankList.length !== 0) &&
          <Content loading={fetchGradeRankListLoading} className="mb-3">
            <Card title="前五名的同学">
              <table className="zi-table">
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
            </Card>
          </Content>
      }

      {
        (gradePiechartData.length !== 0 || fetchGradePiechartDataLoading) &&
          <Content loading={fetchGradePiechartDataLoading} className="mb-3">
            <Card title="分数段统计">
              <Chart height={400} data={gradePiechartData} scale={{ sales: { tickInterval: 20 }}} forceFit>
                <Axis name="grade" />
                <Axis name="count" />
                <Tooltip crosshairs={{ type: 'y' }} />
                <Geom type="interval" position="grade*count" />
              </Chart>
            </Card>
          </Content>
      }
    </div>
  );
};

export default GradeAssess;

import {
  User,
  ArrowUp,
  Gauge,
  FolderOpenDot,
  Briefcase,
  UserPlus,
  ClockCheck,
  GraduationCap,
  UserStar,
  ChevronDown
} from "lucide-react";
import ApexCharts from "apexcharts";
import { useEffect } from "react";

const options = {
    chart: {
        height: 352,
        type: 'line',
        stacked: false,
        toolbar: { show: false }
    },
    series: [
        {
            name: 'Subscriptions',
            type: 'area',
            data: [35, 65, 50, 70, 55, 60, 45, 43, 75, 55, 63, 68],
            color: "#FEBB7B"
        },
        {
            name: 'Earnings',
            type: 'column',
            data: [90, 100, 70, 110, 80, 85, 60, 30, 95, 40, 85, 35],

            color: "#4F46E5",
        },
        {
            name: 'Refunds',
            type: 'line',
            data: [10, 15, 12, 20, 18, 10, 5, 8, 10, 25, 14, 20],
            color: "var(--color-success)",
            stroke: {
                dashArray: 5,
                width: 2
            }
        }
    ],
    stroke: {
        width: [2, 0, 2],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '45%'
        }
    },
    fill: {
        opacity: [0.2, 1, 1]
    },
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    markers: {
        size: 5
    },
    xaxis: {
        type: 'category',
        labels: {
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: 'var(--color-body)',
                fontSize: '12px',
                fontFamily: 'var(--ff-body)',
                fontWeight: 400,
                cssClass: 'apexcharts-yaxis-label',
            },
        },
    },
    legend: {
        position: "top",
        labels: {
            colors: "var(--color-body)",
        },
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (val: string) {
                return "$" + val;
            }
        },
    },
};

function Dashboard() {

  useEffect(() => {
    const chartElement = document.querySelector("#order-status");
    if (chartElement) {
      const chart = new ApexCharts(chartElement, options);
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  });
  return (
    <div className="app-content-wrap">
      <div className="container-fluid">
        <div className="row fix">
          <div className="col-12 col-lg-3 col-md-6 col-12">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-primary-transparent text-primary">
                  <User size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Total Employees</span>
                  <h2 className="mb-5">1,250</h2>
                  <span className="text-success">
                    +5% <ArrowUp size={12} className="ri-arrow-up-line"/>
                  </span>
                  <span className="fs-12 text-muted ml-5">vs. last month</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-warning-transparent text-warning">
                  <Gauge size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">On Leave Today</span>
                  <h2 className="mb-5">42</h2>
                  <span className="fs-12 text-muted">Sick/Annual Leave</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-info-transparent text-info">
                  <FolderOpenDot size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Active Projects</span>
                  <h2 className="mb-5">28</h2>
                  <span className="text-success">
                    +3 New
                    <ArrowUp size={12} className="ri-arrow-up-line"/>
                  </span>
                  <span className="fs-12 text-muted ml-5">this week</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-purple-transparent text-purple">
                  <Briefcase size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Job Applicants</span>
                  <h2 className="mb-5">156</h2>
                  <span className="fs-12 text-muted">30-day pipeline</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-success-transparent text-success">
                  <UserPlus size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">New Hires (MTD)</span>
                  <h2 className="mb-5">15</h2>
                  <span className="text-success">
                    +10%
                    <ArrowUp size={12} className="ri-arrow-up-line" />
                  </span>
                  <span className="fs-12 text-muted ml-5">YoY</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-slateblue-transparent text-slateblue">
                  <ClockCheck size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Attendance Rate</span>
                  <h2 className="mb-5">94%</h2>
                  <span className="fs-12 text-muted">This week</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-teal-transparent text-teal">
                  <GraduationCap size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Training Completed</span>
                  <h2 className="mb-5">120 hrs</h2>
                  <span className="text-success">
                    +25%<ArrowUp size={12} className="ri-arrow-up-line" />
                  </span>
                  <span className="fs-12 text-muted ml-5">QoQ</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-3 col-md-6">
            <div className="card">
              <div className="card-body mini-card-body d-flex align-center gap-16">
                <div className="avatar avatar-xl bg-pink-transparent text-pink">
                  <UserStar size={42}/>
                </div>
                <div className="card-content">
                  <span className="d-block fs-16 mb-5">Employee eNPS</span>
                  <h2 className="mb-5">72</h2>
                  <span className="fs-12 text-muted">Engagement Score</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card">
              <div className="card-header justify-between">
                <h4>Revenue Report</h4>
                <div className="card-dropdown">
                    <div className="dropdown">
                      <a className="card-dropdown-icon" href="javascript:void(0);" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <ChevronDown />
                      </a>
                      <div className="dropdown-menu">
                        <a className="dropdown-item" href="javascript:void(0);">This Week</a>
                        <a className="dropdown-item" href="javascript:void(0);">Last Week</a>
                        <a className="dropdown-item" href="javascript:void(0);">This Month</a>
                      </div>
                    </div>
                </div>
              </div>
              <div className="card-body pt-15">
                <div id="order-status"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

import { observable, action } from 'mobx';
import axios from 'axios';

class PointStore {
  @observable pointList = [];

  @observable totalPoint = 0;

  @observable currentBoardMaxPage = 0;

  constructor(root) {
    this.root = root;
  }

  @action getPointData = ((currentPage) => {
    const { userData } = this.root.UserStore;

    if (userData) {
      axios.get('/api/user/point', {
        params: {
          userId: userData.id,
          currentPage,
        },
      })
        .then((response) => {
          if (response.data) {
            this.pointList = response.data;

            if (response.data.length === 0) {
              this.currentBoardMaxPage = 0;
            } else {
              const { pageCount } = response.data[0];
              this.currentBoardMaxPage = pageCount;
            }
          }
        })
        .catch((response) => {
          console.log(response);
        });
    } else {
      this.pointList = [];
    }
  });

  @action getTotalPointData = (() => {
    const { userData } = this.root.UserStore;

    if (userData) {
      axios.get('/api/user/point/sum', {
        params: {
          userId: userData.id,
        },
      })
        .then((response) => {
          if (response.data) {
            this.totalPoint = response.data;
          }
        })
        .catch((response) => {
          console.log(response);
        });
    } else {
      this.totalPoint = 0;
    }
  });
}

export default PointStore;

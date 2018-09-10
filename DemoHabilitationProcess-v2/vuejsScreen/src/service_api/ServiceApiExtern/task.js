/* eslint-disable */
import Client from '@/api/api_extern_camunda';

export default {
  // service for getting task list
  async getTaskList(name) {
    return Client.get('/task', {
      params: {
        processDefinitionKey: 'habillitation_process',
        name: name,
      },
    })
      .then((response) => response.data)
      .catch((error) => {
        // Error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // eslint-disable-next-line
          console.log(
            'The request was made and the server responded with a status code != 2xx',
            error.response
          );
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // eslint-disable-next-line
          console.log(
            'The request was made but no response was received',
            error.request
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          // eslint-disable-next-line
          console.log(
            'Something happened in setting up the request that triggered an Error',
            error.message
          );
        }
        // eslint-disable-next-line
        console.log(error.config);
      });
  },

  // service for getting task detail
  async getTask(id) {
    return Client.get(`/task/${id}/variables`, {})
      .then((response) => response.data)
      .catch((error) => {
        // Error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // eslint-disable-next-line
          console.log(
            'The request was made and the server responded with a status code != 2xx',
            error.response
          );
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // eslint-disable-next-line
          console.log(
            'The request was made but no response was received',
            error.request
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          // eslint-disable-next-line
          console.log(
            'Something happened in setting up the request that triggered an Error',
            error.message
          );
        }
        // eslint-disable-next-line
        console.log(error.config);
      });
  },

  // service for getting task detail
  async completeTask(id, data) {
    return Client.post(`/task/${id}/complete`, data)
      .then((response) => response)
      .catch((error) => {
        // Error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // eslint-disable-next-line
          console.log(
            'The request was made and the server responded with a status code != 2xx',
            error.response
          );
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // eslint-disable-next-line
          console.log(
            'The request was made but no response was received',
            error.request
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          // eslint-disable-next-line
          console.log(
            'Something happened in setting up the request that triggered an Error',
            error.message
          );
        }
        // eslint-disable-next-line
        console.log(error.config);
      });
  },
};

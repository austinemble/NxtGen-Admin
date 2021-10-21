import axios from "../helpers/axios";
import { pageConstants } from "./constants";

export const createPage = (form) => {
    return async dispatch => {
        dispatch({ type: pageConstants.CREATE_PAGE_REQUEST });
        try{
            const res = await axios.post('/page/create', form);
            if(res.status === 201){
                dispatch({
                    type: pageConstants.CREATE_PAGE_SUCCESS,
                    payload: { page: res.data.page }
                });
            }else{
                dispatch({
                    type: pageConstants.CREATE_PAGE_FAILURE,
                    payload: { error: res.data.error }
                });
            }
        }catch(error){
            console.log(error)
        }
    }
}

export const deletePageById = (payload) => {
    return async (dispatch) => {
      try {
        const res = await axios.delete(`product/deletePageById`, {
          data: { payload },
        });
        dispatch({ type: pageConstants.DELETE_PAGE_BY_ID_REQUEST });
        if (res.status === 202) {
          dispatch({ type: pageConstants.DELETE_PAGE_BY_ID_SUCCESS });
          dispatch(getPages());
        } else {
          const { error } = res.data;
          dispatch({
            type: pageConstants.DELETE_PAGE_BY_ID_FAILURE,
            payload: {
              error,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
  };

  const getPages = () => {
    return async (dispatch) => {
      try {
        dispatch({ type: pageConstants.GET_ALL_PAGES_REQUEST });
        const res = await axios.post(`page/getpage`);
        if (res.status === 200) {
          const { pages } = res.data;
          dispatch({
            type: pageConstants.GET_ALL_PAGES_SUCCESS,
            payload: { pages },
          });
        } else {
          dispatch({ type: pageConstants.GET_ALL_PAGES_FAILURE });
        }
      } catch (error) {
        console.log(error);
      }
    };
  };
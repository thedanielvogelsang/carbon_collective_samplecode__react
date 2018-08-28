import {FETCH_REGIONS} from '../actions/areatypes' ;

const initialState = {
  household: null,
  neighborhood: null,
  city: null,
  region: null,
  country: null
}


const areaReducer = (state = initialState, action) => {
  switch(action.type){
    case FETCH_REGIONS:
      return {
        ...state,
        
      }
  }
}

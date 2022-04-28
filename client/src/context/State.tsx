import { createContext, useReducer } from "react";
import { cardReducer } from "./Reducer";


export const CardContext = createContext()


const CardState = ({ children }) => {

    const initialState = {
        listItems: []
    }

    const [state, dispatch] = useReducer(cardReducer, initialState)


    const addToVote = (product) => {

        dispatch({
            type:'ADD_TO_VOTE',
            payload: product
        })
        
    }



    return (
        <CardContext.Provider value={{
            addToVote,
            listItems: state.listItems
        }}>
            {children}
        </CardContext.Provider>
    )

}

export default CardState


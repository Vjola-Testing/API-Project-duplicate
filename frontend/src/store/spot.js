import { csrfFetch } from "./csrf"

const GET_ALL_SPOTS = 'spots/spots'
const GET_SPOT_DETAILS='spots/individual_spot'
const GET_USER_SPOTS='spots/currentUser'
const DELETE_SPOT='spots/delete'

const getAllSpotsAction = spots => ({
        type: GET_ALL_SPOTS,
        spots
})

const getSpotDetails = spot => ({
    type: GET_SPOT_DETAILS,
    spot
})


const getUserSpots = spots => ({
    type: GET_USER_SPOTS,
    spots
})

const deleteSpot = spotId => ({
    type: DELETE_SPOT,
    spotId
})

export const allSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots')
    const spots = await res.json();
    if (res.ok) {
        dispatch(getAllSpotsAction(spots["Spots"]))
        return spots;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const getUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots/current')
    const spots = await res.json();
    if (res.ok) {
        dispatch(getUserSpots(spots["Spots"]))
        return spots;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const spotDetailThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`)
    const spot = await res.json();
    if (res.ok) {
        dispatch(getSpotDetails(spot))
        return spot;
    } else {
        const errorData = await res.json()
        return errorData
    }
}

export const createSpotThunk = (spot, owner, imagesArray) => async (dispatch) => {
try {
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spot)
    })
    if (res.ok) {
        const newSpot = await res.json();
        const spotImagesArray = [];

        for (let image of imagesArray) {
            image.spotId = newSpot.id;
            const imageData = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(image)
            })
            if (imageData.ok) {
                const image = await imageData.json();
                spotImagesArray.push(image)
            }
        }
        newSpot.SpotImages = spotImagesArray;
        newSpot.owner = owner
        await dispatch(getSpotDetails(newSpot))
        return newSpot
    }
} catch (err) {
    const error = await err.json();
    return error;
}
} 

export const deleteSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    if (res.ok) {
        dispatch(deleteSpot(spotId))
    } else {
        const errorData = await res.json()
        return errorData
    }
}


export const spotReducer = (state =  {}, action) => {
    let newState;
    switch(action.type) {
        case GET_ALL_SPOTS:
            newState = {...state, allSpots: action.spots}
            return newState
        case GET_SPOT_DETAILS:
            newState = {...state, singleSpot: action.spot}
            return newState
        case GET_USER_SPOTS:
            newState =  {...state, allSpots: action.spots}
            return newState
        case DELETE_SPOT:
            newState = {...state}
            delete newState[action.spotId];
            return newState
        default:
            return state
    }
}
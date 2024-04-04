import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from "react-router-dom";
import router from "./router/index.tsx";
import { Provider } from 'react-redux'
import {store} from './app/store'
import client from "./config/client.ts";
import {login} from "./features/userSlice.ts"
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";




const queryClient = new QueryClient()

client
    .get('/api/me')
    .then(response => {
        store.dispatch(login(response.data.data));
    })
    .catch(e => {
        console.log(e);
    })
    .finally(() => {
        ReactDOM.createRoot(document.getElementById('root')!).render(
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <Provider store={store}>
                        <RouterProvider router={router}/>
                    </Provider>
                </QueryClientProvider>
            </React.StrictMode>,
        )
    })


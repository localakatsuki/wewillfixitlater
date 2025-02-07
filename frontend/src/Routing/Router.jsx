// import routes from './routes/routes';
// import { map } from 'lodash';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import LoginPage from '../screens/Login';
// import { Suspense } from 'react';

// function Router(){
//     const routesVar = map(routes)
//     return (
//         <BrowserRouter>
//         <Routes>
//             <Route path="/login" name="Login Page" render={(props)=><LoginPage{...props}/>}/>
//             <Route path="/home">
//             <Suspense fallback={<div>Loading...</div>}>
//             <Routes>
//             {routesVar.map((route, index) => (
//                 <Route
//                     key={index}
//                     path={route.path}
//                     exact={route.isExact}
//                     element={<route.Component/>}
//                 />
//             ))}
//             </Routes>
//             </Suspense>
//             </Route>
            
//         </Routes>
//         </BrowserRouter>
//     )
// }

// export default Router;
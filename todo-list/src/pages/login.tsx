'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getCookie } from "cookies-next";

import * as Yup from 'yup';

import { loginService } from './service/login';
import Link from 'next/link';

export default Login;

function Login() {
    const router = useRouter();

    useEffect(() => {
        if (getCookie('sessionToken')) {
            router.push('/');
        }
    }, []);

    const [message, setMessage] = useState(null);
    useEffect(() => {
        if(router.query?.form === 'user_submited') {
           setMessage('User registered with Success!')
           setTimeout(() => {
                window.history.replaceState(null, '', '/login')
                setMessage(null)
        }, 5000);
        }
    }, [router.query]);

    const formOptions = { resolver: yupResolver(Yup.object().shape({
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
        apiError: Yup.object()
    }))};

    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = ({ email, password }) => {
        setMessage(null);
        loginService.login({ email, password })
            .then(() => {
                router.push('/');
            })
            .catch(error => {
                setError('apiError', { message: error });
            });
    }

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="alert alert-info">
                <div>Try</div>
                <ul className="ml-3">
                    <li>Email:      test@test.com.br</li>
                    <li>Password:   123456</li>
                </ul>
            </div>
            {errors.apiError &&
                <div className="alert alert-danger">{errors.apiError.message}</div>
            }
            {message &&
                <div className="alert alert-success">{message}</div>
            }
            <div className="card">
                <h4 className="card-header">TODO List</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input name="email" type="text" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                    </form>
                </div>
                <div className="card-footer float-right"><Link href="/register">New user? Click here</Link></div>
            </div>
        </div>
    );
}

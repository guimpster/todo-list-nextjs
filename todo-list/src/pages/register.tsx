import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';

import { userService } from './service/user';
import { yupResolver } from '@hookform/resolvers/yup';

export default Register;

function Register() {
    const router = useRouter();

    const formOptions = { resolver: yupResolver(Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required'),
        password: Yup.string().required('Password is required'),
        apiError: Yup.object()
    }))};

    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = ({ name, email, password }) => {
        userService.register({ name, email, password })
            .then(() => {
                router.push({ pathname: "/login", query: { form: "user_submited" } });
            })
            .catch(error => {
                setError('apiError', { message: error });
            });
    }

    return (
        <div className="col-md-6 offset-md-3 mt-5">
            <div className="card">
                <h4 className="card-header">User registration</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                            <label>Name</label>
                            <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.name?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
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
                            Register
                        </button>
                        {errors.apiError &&
                            <div className="alert alert-danger mt-3 mb-0">{errors.apiError.message}</div>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

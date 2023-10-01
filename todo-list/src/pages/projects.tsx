import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { getCookie } from "cookies-next";
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { projectService } from './service/project';
import { taskService } from './service/task';

import { FaRegTrashAlt } from 'react-icons/fa'
import { MdModeEdit } from 'react-icons/md'

export default Projects;

function Projects() {
    const [projects, setProjects] = useState(() => []);

    useEffect(() => {
        projectService.getProjects(getCookie('sessionToken'))
            .then(response => setProjects(response));
    }, []);

    const handleAddTask = (event) => {
        event.preventDefault();

        const projectId = event.currentTarget.elements.projectId.value;
        const description = event.currentTarget.elements.description.value;

        taskService.createTask({ description, projectId })
            .then(response => {
                const newProjects = 
                    projects.map((project: object) => ({
                        ...project,
                        tasks: project?.tasks?.map(task => ({
                            ...task,
                        }))
                    }))
                const editedProject = newProjects.find(project => project.id === projectId);
                if (!editedProject) return;

                if (editedProject.tasks)
                    editedProject.tasks.push(response.data.task)
                else editedProject.tasks = [response.data.task]
                
                setProjects(newProjects);
            })
    }

    const handleCheckTask = (checkedTask) => {
        taskService.checkTask(checkedTask)
            .then(response => {
                const newProjects = 
                    projects.map((project: object) => ({
                        ...project,
                        tasks: project?.tasks?.map(task => ({
                            ...task,
                            endedAt: task.id === checkedTask.id ? response.data.task.endedAt : task.endedAt
                        }))
                    }))
                setProjects(newProjects) 
            })
    }

    const handleDeleteProject = (projectId) => {
        projectService.delete(projectId)
            .then(() => {
                const newProjects = 
                    projects.filter(project => project.id !== projectId)
                        .map((project: object) => ({
                        ...project,
                        tasks: project?.tasks?.map(task => ({
                            ...task,
                        }))
                    }))
                setProjects(newProjects);
            })
    }

    const projectFormOptions = { resolver: yupResolver(Yup.object().shape({
        title: Yup.string().required('Title is required')
    }))};

    const { handleSubmit: handleProjectSubmit, formState, register: registerProject } = useForm(projectFormOptions);

    const handleNewProject = ({ title }) => {
        projectService.add({ title })
            .then(response => {
                const newProject = response.data.project;
                const newProjects = 
                    projects
                        .map((project: object) => ({
                        ...project,
                        tasks: project?.tasks?.map(task => ({
                            ...task,
                        }))
                    }))
                setProjects([...newProjects, newProject]);
            })
    }

    const handleDeleteTask = ({ id, projectId }) => {
        taskService.delete({ taskId: id, projectId })
            .then(response => {
                const newProjects = 
                    projects
                        .map((project: object) => ({
                        ...project,
                        tasks: project?.tasks?.filter(task => task.id !== id).map(task => ({
                            ...task,
                        }))
                    }))
                setProjects(newProjects);
            })
    }

    const [show, setShow] = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [projectEditForm, setProjectEditForm] = useState({
        projectId: '',
        title: ''
    });

    const handleModalProjectChange = (e) => {
        setProjectEditForm({
            ...projectEditForm,
            title: e.target.value
        })
    }

    const handleChangeEditProject = ({ id: projectId, title }) => {
        setProjectEditForm({
            title,
            projectId,
        })
        handleShow()
    }

    const handleEditProject = () => {
        handleClose();
        projectService.edit(projectEditForm)
            .then(response => {
                const newProjects = 
                    projects
                        .map((project: object) => ({
                        ...project,
                        title: project.id === projectEditForm.projectId ? response.data.project.title : project.title,
                        tasks: project?.tasks?.map(task => ({
                            ...task,
                        }))
                    }))
                setProjects(newProjects);
            })
    }
    
    return (
        <div className="container">
            <div className="row">
                {
                    projects.map(project => (
                        <div className="col-lg-4" key={project.id}>
                            <div className="card">
                                <h5 className="card-header" >
                                    <span id={`${project.id}_project_title`}>{project.title}</span>
                                    <button type="button" onClick={() => handleDeleteProject(project.id)} className="close">
                                        <FaRegTrashAlt size={15}/>
                                    </button>
                                    <span className="close">&nbsp;</span>
                                    <button type="button" onClick={() => handleChangeEditProject(project)} className="close">
                                        <MdModeEdit size={15}/>
                                    </button>
                                </h5>
                                <div className="card-body">
                                    <h5 className="card-title">TODO</h5>
                                    <div>
                                        {
                                            project?.tasks?.filter(task => !task.endedAt).map(task => (
                                                <div className="form-check ml-3" key={`${task.id}_div`}>
                                                    <input className="form-check-input" onClick={() => handleCheckTask(task)} type="checkbox" value="" id={`${task.id}_task`}/>
                                                    <label className="form-check-label" htmlFor={`${task.id}_task`} >
                                                        {task.description}
                                                    </label>
                                                    <button className="ml-2 mt-1 trash-btn" onClick={() => handleDeleteTask(task)}>
                                                        <FaRegTrashAlt size={13}/>
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div><br/></div>
                                    <h5 className="card-title">DONE</h5>
                                    <div>
                                        {
                                            project?.tasks?.filter(task => !!task.endedAt).map(task => (
                                                <div className="form-check ml-3" key={`${task.id}_div`} data-toggle="tooltip" data-placement="top" title={`Finished at ${moment(task.endedAt).format('MMMM Do YYYY, h:mm:ss a')}`}>
                                                    <input className="form-check-input" onClick={e => e.preventDefault()} type="checkbox" defaultChecked={task.endedAt} id={`${task.id}_task`}/>
                                                    <label className="form-check-label" htmlFor={`${task.id}_task`} >
                                                        {task.description}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="form-group">
                                        <form onSubmit={handleAddTask} id={`${project.id}_form`}>
                                            <div className="input-group mb-3">
                                                <input name="projectId" type="hidden" value={project.id}/>
                                                <input name="description" type="text" className="form-control" placeholder="Task" aria-label="" aria-describedby="basic-addon1"/>
                                                <div className="input-group-prepend">
                                                    <button type="submit" className="btn btn-outline-success" form={`${project.id}_form`}>Add</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <div className="col-lg-4">
                    <div className="card">
                        <h5 className="card-header">
                            Create New Project
                        </h5>
                        <div className="card-body">
                            <form onSubmit={handleProjectSubmit(handleNewProject)}>
                                <div className="form-group">
                                    <input name="title" className="form-control" placeholder="Project Name" type="text" {...registerProject('title')} />
                                </div>
                                <button disabled={formState.isSubmitting} className="btn btn-primary">
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Create Project
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <input 
                                name="title" 
                                className="form-control"
                                onChange={handleModalProjectChange}
                                value={projectEditForm.title}
                                placeholder="Project Name"
                                type="text"/>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={handleClose} className="btn btn-secondary">
                        Close
                    </button>
                    <button onClick={handleEditProject} className="btn btn-primary">
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

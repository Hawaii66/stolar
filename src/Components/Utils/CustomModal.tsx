import React from 'react'
import { Button, Modal } from 'react-bootstrap'

interface Props{
    show:boolean,
    buttonClicked:(index:number)=>void,
    children:JSX.Element,
    title:string,
    buttons:{title:string,variant:string}[]
}

function CustomModal({show,buttonClicked,children,title,buttons}:Props) {
    return (
        <div>
            <Modal show={show} onHide={()=>buttonClicked(-1)} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
                <Modal.Footer>
                    {buttons.map((item,index)=>{
                        return(
                            <Button key={index} variant={item.variant} onClick={()=>buttonClicked(index)}>
                                {item.title}
                            </Button>
                        )
                    })}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CustomModal

import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody,
  CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody,Row,Label,Col} from 'reactstrap';
  import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform} from 'react-animation-components';


const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);
    class CommentForm extends Component{
        constructor(props) {
            super(props);
            this.toggleModal = this.toggleModal.bind(this);
            this.handleSubmit=this.handleSubmit.bind(this);
            this.state = {
                isModalOpen: false
            };
          }
        toggleModal() {
            this.setState({
              isModalOpen: !this.state.isModalOpen
            });
          }
          handleSubmit(values) {
            this.toggleModal();
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
            //event.preventDefault();
    
        }
        render(){
            return(
                <div>
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody className="m-2">
                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Label htmlFor="rating" className="ml-3">Rating</Label>
                                <Col md={12}>
                                <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                              </Row>
                              <Row className="form-group">
                                <Label htmlFor="author"className="ml-3">Author</Label>
                                <Col md={12}>
                                <Control.text model=".author" id="author" name="author" className="form-control"
                                  validators={{
                                    minLength: minLength(3), maxLength: maxLength(15)
                                }}/>
                                     <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required ',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                     />
                                </Col>
                                
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment"className="ml-3">Comment</Label>
                                <Col md={12}>
                                <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"
                                        className="form-control" />
                                </Col>
                             </Row>
                            <Button type="submit" value="submit" color="primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
            )
      }
 }
 
    function RenderDish({dish}){
            if (dish != null)
                return(
                      <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
            <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
            </FadeTransform>
                );
            else
                return(
                    <div></div>
                );
        } 
        function RenderComments({com, postComment, dishId}){
            if(com===undefined)
            return(
               <div></div>
             );
           else{
            const c= com.map((z)=>{
                return(
                    <div key={z.id}>
                       <ul className="list-unstyled">
                       <li>{z.comment}</li>
                       <li>--{z.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(z.date)))}</li>
                      </ul>
                      </div>
                   
                 
                );
            })
            return (
                <div>
                <h4>Comment</h4>
                 <div>{c}</div> 
                 <CommentForm dishId={dishId} postComment={postComment} />
                </div>
                
            )
           }
        }

        const  DishDetail = (props) =>{
            if (props.isLoading) {
                return(
                    <div className="container">
                        <div className="row">            
                            <Loading />
                        </div>
                    </div>
                );
            }
            else if (props.errMess) {
                return(
                    <div className="container">
                        <div className="row">            
                            <h4>{props.errMess}</h4>
                        </div>
                    </div>
                );
            }
            else if (props.dish != null)
          return (
            <div className="container">
            <div className="row">
                <Breadcrumb>

                    <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                    <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                </Breadcrumb>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                    <hr />
                </div>                
            </div>
            <div className="row">
                <div className="col-12 col-md-5 m-1">
                    <RenderDish dish={props.dish} />
                </div>
                <div className="col-12 col-md-5 m-1">
                    <RenderComments com={props.comments} 
                      postComment={props.postComment}
                     dishId={props.dish.id}/>
                </div>
            </div>
            </div>
        );
         }
export default DishDetail;
    

 
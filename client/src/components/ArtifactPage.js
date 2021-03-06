import React, { Component } from "react";

import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";
import ArtifactTable from "./ArtifactTable";
// import ImageGallery from "react-image-gallery";
import {
  Container,
  Header,
  Menu,
  Image,
  Divider,
  Responsive,
  Segment,
  Icon,
  Table
} from "semantic-ui-react";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        filter: "invert(100%)"
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "block",
        background: "black",
        filter: "invert(100%)"
      }}
      onClick={onClick}
    />
  );
}
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />
  // centerMode: true
};

class ArtifactPage extends Component {
  // const ArtifactPage = ({ id }) => {

  state = {
    artifact: [],
    images: [],
    owner: []
  };
  componentDidMount() {
    const { id } = this.props.match.params;

    axios.get(`/api/artifacts/${id}`).then(res => {
      const artifact = res.data;
      this.setState(() => ({ artifact }));
    });

    axios.get(`/api/images/${id}`).then(res => {
      const images = res.data;
      this.setState(() => ({ images }));
    });
  }

  cleanPath(path) {
    if (path === "") {
      return "placeholder.png";
    } else {
      return path;
    }
  }

  handleDelete = artifactID => {
    console.log(artifactID);
    console.log("Jimmy!");

    axios.delete("/artifacts/delete", { data: { id: artifactID } });
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });
  };

  // Function to handle null geotags
  handleGeotag(geotag) {
    if (geotag) {
      return (
        <Table.Row>
          <Table.Cell>Current Location</Table.Cell>
          {/* <Table.Cell>Not available</Table.Cell> */}
          <Table.Cell>{geotag}</Table.Cell>
        </Table.Row>
      );
    }
  }

  // handleOwner(owner) {
  //   var ownerData = null;
  //   if (owner) {
  //     // axios.get(`/api/familymember/${owner}`).then(res => {
  //     //   ownerData = res.data;
  //     //   console.log(ownerData);
  //     // });
  //     return (
  //       <React.Fragment>
  //         {/* {ownerData.map(own => ( */}
  //         <Table.Row>
  //           <Table.Cell>Current Owner</Table.Cell>
  //           <Table.Cell>
  //             {this.state.owner.Firstname + " " + this.state.owner.Lastname}
  //           </Table.Cell>
  //         </Table.Row>
  //         {/* ))} */}
  //       </React.Fragment>
  //     );
  //   }
  // }

  render() {
    return (
      <Responsive>
        {this.state.artifact.map(artifact => (
          <Container style={{ minHeight: 600, padding: "1em 0em" }}>
            <Header
              as="h2"
              textAlign="center"
              content={artifact.Name}
              subheader={"More information about the artifact"}
            />
            <Menu pointing secondary color="blue">
              <Menu.Menu position="right">
                <Menu.Item
                  as={Link}
                  to={"/artifactpage/update/" + artifact.ArtifactID}
                  name="Update Artifact"
                  desc="Update artifact"
                  // active={activeItem === "Register Artifact"}
                  // onClick={this.handleItemClick}
                />
                <Menu.Item
                  as={Link}
                  to={"/artifacts"}
                  name="Delete Artifact"
                  desc="Delete artifact"
                  onClick={() => {
                    this.handleDelete(artifact.ArtifactID);
                  }}
                  // active={activeItem === "Register Artifact"}
                  // onClick={this.handleItemClick}
                />
              </Menu.Menu>
            </Menu>
            <Slider {...settings}>
              {this.state.images.map(image => (
                <div>
                  <Image
                    size="large"
                    centered
                    src={require("../artifactImages/" +
                      this.cleanPath(image.FilePath))}
                    bordered
                  />
                </div>
              ))}
            </Slider>
            <Segment style={{ padding: "3em 0em" }} vertical>
              <Container text>
                <Divider horizontal>
                  <Header as="h4">
                    <Icon name="book" />
                    Description
                  </Header>
                </Divider>
                <p style={{ fontSize: "1.2em" }}>{artifact.Description}</p>
                <Divider horizontal>
                  <Header as="h4">
                    <Icon name="info circle" />
                    Details
                  </Header>
                </Divider>
                <Table definition color="blue">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={2}>Name</Table.Cell>
                      <Table.Cell>{artifact.Name}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Type</Table.Cell>
                      <Table.Cell>{artifact.Type}</Table.Cell>
                    </Table.Row>
                    {/* {this.handleOwner(artifact.CurrentOwner)} */}
                    <ArtifactTable owner={artifact.CurrentOwner} />
                    {/* {this.handleGeotag(artifact.Geotag)} */}
                    <Table.Row>
                      <Table.Cell>Date Acquired</Table.Cell>
                      <Table.Cell>{artifact.DateAcquireYear}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Container>
            </Segment>
          </Container>
        ))}
      </Responsive>
    );
  }
}
// }

export default ArtifactPage;

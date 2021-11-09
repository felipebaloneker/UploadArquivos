import React, {Component} from 'react';
import GlobalStyle from "./styles/global";
import {Container, Content} from './styles';
import {uniqueId} from 'lodash';
import filesize from 'filesize';

import Upload from "./components/upload";
import FileList from "./components/FileList";

class App extends Component {
  state = {
    uploadedFiles:[],
  };
  handleUpload = files =>{
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name:file.name,
      readableSize:filesize(file.size),
      preview: URL.createObjectURL(file),
      progress:0,
      uploaded:false,
      error:false,
      url:null,
    }))

    this.setState({uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)})
  };

  render(){
    return (
      <Container>
        <Content>
            <Upload onUpload={this.handleUpload}/>
            {!!uploadedFiles.length && (
              <FileList  files={uploadedFiles}/>
            )}
        </Content>
        <GlobalStyle/>
      </Container>
    );
  }
}

export default App;

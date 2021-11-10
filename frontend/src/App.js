import React, {Component} from 'react';
import GlobalStyle from "./styles/global";
import {Container, Content} from './styles';
import {uniqueId} from 'lodash';
import filesize from 'filesize';

import Upload from "./components/upload";
import FileList from "./components/FileList";

import api from "./services/api";

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

      /// upload do arquivo no backend
     uploadedFiles.forEach(this.processUpload)
  };

 // função de upload 
  updateFile = (id, data) => {
    this.setState({
      uploadedFiles: this.state.uploadedFiles.map(uploadedFile =>{
      return id === uploadedFile.id ? {...uploadedFile, ...data} :uploadedFile;
    })})
  }

  processUpload = (uploadedFile) => {
    const data  = new FormData();

    data.append('file',uploadedFile.file, uploadedFile.name);

    api.post('posts', data,{
      // barra de progresso do upload
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100)/ e.total));

        this.updateFile(uploadedFile.id,{
          progress,
        });
      }
    }).then(response => {
      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data._id,
        url: response.data.url
      });
    })
    .catch(() => {
      this.updateFile(uploadedFile.id, {
        error: true
      });
    });
  }

  render(){
    const { uploadedFiles } = this.state;
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

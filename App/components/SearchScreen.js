import React, { Component } from 'react';
import axios from 'axios'
import { Text, View, StyleSheet, TextInput, PickerIOS, FlatList, Alert, Image } from 'react-native'
import utils from '../utils/utils'
import queries from './SearchQueries'

class SearchScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchTex: '',
      selectedOption: '',
      placeHolderText: 'Search',
      recordsFound: [],
    }
    this.showError = false;
  }

  _getContributors = searchTex => {
    const splitedText = searchTex.split(':')

    // validate if the text was written as we expected
    if (splitedText.length === 1) {
      return false
    }

    let owner = String(splitedText[0]).toLowerCase()
    let repo = String(splitedText[1]).toLowerCase()

    const reqConf = utils.getApiRestConfig()

    axios(reqConf)
      .then(response => {
        if (response.data.length) this.setState({ recordsFound: response.data })
      })
      .catch(error => {
        this.handleFailureRequest(error)
      })
  }

  handleFailureRequest = error => {
    if (error && error.message == 'Request failed with status code 403' && !this.showError) {
      this.showError = true;
      Alert.alert(
        'Error!',
        'You did many attempts when quering the git api, try again in an hour',
        [
          { text: 'OK', onPress: () => this.showError = false },
        ],
        { cancelable: false }
      )
    }
  }

  _getRepositories(searchText) {
    // https://developer.github.com/v4/guides/forming-calls/#authenticating-with-graphql
    // get the config for request
    const reqConf = utils.getGithubConfig(queries.getAllRepositoresByKeyWord(searchText))

    axios(reqConf)
      .then(response => {
        const { data: { data: { search: { edges } } } } = response

        if (edges && edges.length) {
          const repositories = edges.map((repo, index) => {
            return {
              id: index,
              name: repo['node']['name'],
              description: repo['node']['description'],
              url: repo['node']['url']
            }
          })
          this.setState({ recordsFound: repositories })
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }


  _onInputChange = (textValue) => {
    let { selectedOption } = this.state
		
    if (selectedOption === 'contributors') {
      this._getContributors(textValue)
    } else if (selectedOption === 'repositories') {
      this._getRepositories(textValue)
    }
    this.setState({ searchTex: textValue })
  }

  _onSelectChange = (selectedOption) => {
    //const value = e.target.value
    let placeHolderText = ''

    if (selectedOption === 'contributors') {
      placeHolderText = 'Fill in facebook:react'
    } else if (selectedOption === 'repositories') {
      placeHolderText = 'Fill in facebook'
    }

    this.setState({
      selectedOption: selectedOption,
      placeHolderText: placeHolderText,
      recordsFound: [],
      searchTex: ''
    })
  }

  _getItemList = record => {
    if (this.state.selectedOption === 'contributors') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 60, height: 80, marginTop: 10 }}>
            <Image source={{ uri: record['avatar_url'] }} style={styles.imageBox} />
          </View>
          <View style={{ width: 200, height: 80, }}>
            <Text>{record.login}</Text>
            <Text>{record.url}</Text>
            <Text>{record.contributions} contributions</Text>
          </View>
        </View>
      )
    } else if (this.state.selectedOption === 'repositories') {
      return (
        <View style={{ padding: 10 }}>
          <Text>{record['name']}</Text>
          <Text>{record['description']}</Text>
          <Text>{record['url']}</Text>
        </View>
      )
    } else {
      return <View></View>
    }

  }


  render() {

    const { placeHolderText, selectedOption, recordsFound } = this.state

    return (
      <View style={styles.container}>
        <PickerIOS
          onValueChange={this._onSelectChange}
          selectedValue={selectedOption}>
          <PickerIOS.Item label={"Select an option"} value={'default'} />
          <PickerIOS.Item label={"Search repositories"} value={'repositories'} />
          <PickerIOS.Item label={"Search contributors"} value={'contributors'} />
        </PickerIOS>
        <View style={styles.input}>
          <TextInput
            style={styles.inputBox}
            placeholder={placeHolderText}
            onChangeText={this._onInputChange}
            value={this.state.searchTex}
          />
        </View>
        <View style={styles.recordsList}>
          <FlatList
            keyExtractor={item => { return String(item.id) }}
            data={recordsFound}
            renderItem={({ item }) => this._getItemList(item)}
            keyExtractorField="id"
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inputBox: { height: 40, borderColor: 'gray', borderWidth: 1, width: 200 },
  imageBox: {
    width: 50,
    height: 50
  },
  recordsList: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: 400,
    marginTop: 50,

  }
})


export default SearchScreen
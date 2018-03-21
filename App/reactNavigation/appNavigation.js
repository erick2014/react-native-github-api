import { TabNavigator, StackNavigator } from 'react-navigation'

// Components
import SearchScreen from '../components/SearchScreen'

const AppNavigator = StackNavigator({
	SearchScreen: {
		screen: SearchScreen,
		navigationOptions: ({ navigation }) => ({
			header: null,
		})
	},

})

export default AppNavigator
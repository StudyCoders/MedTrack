import { ScrollView } from 'react-native';
import FormUsuario from '../../components/form/FormUsuario';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

export default function UserForm() {
  const { abrirForm } = useLocalSearchParams<any>();

  return (
    <ScrollView>
      <FormUsuario abrirForm={abrirForm}/>
    </ScrollView>
  );
}

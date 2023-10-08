import { ScrollView } from 'react-native';
import FormUsuario from '../../components/form/FormUsuario';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

export default function UserForm() {
  const { abrirForm, id_contato, formContato } = useLocalSearchParams<any>();

  return (
    <ScrollView>
      <FormUsuario abrirForm={abrirForm} id_contato={id_contato}  formContato={formContato} />
    </ScrollView>
  );
}

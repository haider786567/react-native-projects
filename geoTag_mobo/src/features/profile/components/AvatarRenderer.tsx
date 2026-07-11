import React from 'react';
import { Image } from 'react-native';

export const AI_AVATARS = [
  { id: 'avatar_boy', image: require('../../../../assets/images/avatar_person_boy.png'), label: 'Boy' },
  { id: 'avatar_girl', image: require('../../../../assets/images/avatar_person_girl.png'), label: 'Girl' },
  { id: 'avatar_engg_male', image: require('../../../../assets/images/avatar_person_engg_male.png'), label: 'Civil Male' },
  { id: 'avatar_engg_female', image: require('../../../../assets/images/avatar_person_engg_female.png'), label: 'Civil Female' },
  { id: 'avatar_worker', image: require('../../../../assets/images/avatar_person_worker.png'), label: 'Builder' },
];

type AvatarRendererProps = {
  avatarValue?: string;
  sizeClass?: string;
};

export const AvatarRenderer = ({ avatarValue = 'avatar_boy', sizeClass = "h-24 w-24" }: AvatarRendererProps) => {
  if (avatarValue === 'avatar_boy') {
    return <Image source={require('../../../../assets/images/avatar_person_boy.png')} className={`${sizeClass} rounded-full`} resizeMode="cover" />;
  }
  if (avatarValue === 'avatar_girl') {
    return <Image source={require('../../../../assets/images/avatar_person_girl.png')} className={`${sizeClass} rounded-full`} resizeMode="cover" />;
  }
  if (avatarValue === 'avatar_engg_male') {
    return <Image source={require('../../../../assets/images/avatar_person_engg_male.png')} className={`${sizeClass} rounded-full`} resizeMode="cover" />;
  }
  if (avatarValue === 'avatar_engg_female') {
    return <Image source={require('../../../../assets/images/avatar_person_engg_female.png')} className={`${sizeClass} rounded-full`} resizeMode="cover" />;
  }
  if (avatarValue === 'avatar_worker') {
    return <Image source={require('../../../../assets/images/avatar_person_worker.png')} className={`${sizeClass} rounded-full`} resizeMode="cover" />;
  }
  
  if (avatarValue.startsWith('http') || avatarValue.startsWith('/') || avatarValue.startsWith('file:') || avatarValue.startsWith('data:')) {
    return (
      <Image 
        source={{ uri: avatarValue }} 
        className={`${sizeClass} rounded-full`} 
        resizeMode="cover" 
      />
    );
  }
  return <Image source={require('../../../../assets/images/avatar_person_boy.png')} className={`${sizeClass} rounded-full`} resizeMode="cover" />;
};
export default AvatarRenderer;

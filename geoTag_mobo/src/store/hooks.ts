import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./index";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

import { translations } from "../utils/localization";
import { changeLanguage } from "./preferences.slice";

export function useTranslation() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.preferences.language);
  const t = translations[language] || translations.en;

  const setLanguage = (lang: 'en' | 'hi' | 'es') => {
    void dispatch(changeLanguage(lang));
  };

  return { t, language, setLanguage };
}
